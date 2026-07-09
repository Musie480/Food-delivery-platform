import { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { View, type ViewStyle } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

const TILE_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAPLIBRE_VERSION = "4.7";

const ORANGE = "#f97316";

interface MapLibreMapProps {
  center: [number, number];
  zoom?: number;
  marker?: { id: string; lngLat: [number, number] } | null;
  interactive?: boolean;
  style?: ViewStyle;
  onCenterChange?: (center: [number, number]) => void;
  onLoad?: () => void;
}

export interface MapLibreMapRef {
  flyTo: (center: [number, number], zoom?: number) => void;
}

function generateHtml(props: MapLibreMapProps) {
  const [lng, lat] = props.center;
  const zoom = props.zoom ?? 13;
  const interactive = props.interactive ?? true;
  const marker = props.marker;

  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link href="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 100vw; height: 100vh; overflow: hidden; }
  #map { width: 100%; height: 100%; }
  .maplibregl-ctrl-attrib { font-size: 9px !important; }
  ${interactive ? "" : ".maplibregl-ctrl-attrib { display: none !important; }"}
  .pin { display: flex; flex-direction: column; align-items: center; }
  .pin-dot {
    width: 24px; height: 24px; border-radius: 50%;
    background: ${ORANGE}; border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .pin-arrow {
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${ORANGE};
    margin-top: -2px;
  }
</style>
</head>
<body>
<div id="map"></div>
<script>
  const map = new maplibregl.Map({
    container: "map",
    style: "${TILE_STYLE}",
    center: [${lng}, ${lat}],
    zoom: ${zoom},
    attributionControl: ${interactive ? "true" : "false"},
    dragPan: ${interactive ? "true" : "false"},
    scrollZoom: ${interactive ? "true" : "false"},
    touchZoomRotate: ${interactive ? "true" : "false"},
    doubleClickZoom: ${interactive ? "true" : "false"},
  });

  let currentMarker = null;

  function setMarker(lngLat) {
    if (currentMarker) currentMarker.remove();
    const el = document.createElement("div");
    el.className = "pin";
    el.innerHTML = '<div class="pin-dot"></div><div class="pin-arrow"></div>';
    currentMarker = new maplibregl.Marker({ element: el })
      .setLngLat(lngLat)
      .addTo(map);
  }

  ${marker ? `setMarker([${marker.lngLat[0]}, ${marker.lngLat[1]}]);` : ""}

  function send(event, data) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ event, data }));
  }

  map.on("load", () => send("load", {}));

  ${interactive ? `
  let dragTimeout;
  map.on("moveend", () => {
    clearTimeout(dragTimeout);
    dragTimeout = setTimeout(() => {
      const c = map.getCenter();
      send("centerChange", { lng: c.lng, lat: c.lat, zoom: map.getZoom() });
    }, 100);
  });

  map.on("click", (e) => {
    send("mapPress", { lng: e.lngLat.lng, lat: e.lngLat.lat });
  });
  ` : ""}

  window.addEventListener("message", (e) => {
    try {
      const cmd = JSON.parse(e.data);
      if (cmd.type === "flyTo") {
        map.flyTo({ center: cmd.center, zoom: cmd.zoom ?? map.getZoom(), duration: 500 });
      }
      if (cmd.type === "setMarker") {
        setMarker(cmd.center);
      }
      if (cmd.type === "removeMarker") {
        if (currentMarker) { currentMarker.remove(); currentMarker = null; }
      }
    } catch(err) {}
  });
</script>
</body>
</html>`;
}

const MapLibreMap = forwardRef<MapLibreMapRef, MapLibreMapProps>(
  (props, ref) => {
    const webRef = useRef<WebView>(null);
    const html = useRef(generateHtml(props));

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const msg = JSON.parse(event.nativeEvent.data);
          if (msg.event === "centerChange" && props.onCenterChange) {
            props.onCenterChange([msg.data.lng, msg.data.lat]);
          }
          if (msg.event === "load" && props.onLoad) {
            props.onLoad();
          }
        } catch {}
      },
      [props.onCenterChange, props.onLoad],
    );

    useImperativeHandle(ref, () => ({
      flyTo: (center: [number, number], zoom?: number) => {
        webRef.current?.injectJavaScript(JSON.stringify({ type: "flyTo", center, zoom }));
      },
    }));

    return (
      <WebView
        ref={webRef}
        source={{ html: html.current }}
        style={[{ flex: 1 }, props.style]}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={["*"]}
      />
    );
  },
);

MapLibreMap.displayName = "MapLibreMap";
export default MapLibreMap;
