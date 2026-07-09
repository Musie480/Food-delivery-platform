import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera, Mail, Phone, User } from "lucide-react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { useAuthStore } from "../../src/store/authStore";
import { usersApi } from "../../src/api/users";

const ORANGE = "#f97316";
const AVATAR = 110;

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3000";

function avatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      try {
        const { url } = await usersApi.uploadPhoto(result.assets[0].uri);
        setAvatar(url);
        toast.success("Photo uploaded successfully");
      } catch {
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const data: { name?: string; avatar?: string } = {};
      if (name !== user?.name) data.name = name;
      if (avatar !== user?.avatar) data.avatar = avatar;
      
      if (Object.keys(data).length === 0) {
        toast.error("No changes to save");
        setSaving(false);
        return;
      }

      const { user: updated } = await usersApi.updateProfile(data);
      setAuth(updated, accessToken!);
      toast.success("Profile updated");
      router.back();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const src = avatarUrl(avatar);
  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Curved Color Header */}
        <View style={styles.headerBlock}>
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />

          <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
            <View style={styles.headerTopRow}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.headerBackBtn,
                  pressed && styles.headerBtnPressed,
                ]}
              >
                <ArrowLeft size={18} color="#fff" />
              </Pressable>
              <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Avatar Section overlapping boundary */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing}>
            {src ? (
              <Image source={{ uri: src }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [
              styles.avatarEditBadge,
              pressed && styles.avatarEditBadgePressed,
            ]}
          >
            <Camera size={14} color="#fff" />
          </Pressable>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionHeader}>PERSONAL DETAILS</Text>

          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconBox}>
              <User size={18} color="#94a3b8" />
            </View>
            <View style={styles.inputFlex}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Phone Input (Read Only) */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconBox}>
              <Phone size={18} color="#94a3b8" />
            </View>
            <View style={styles.inputFlex}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <Text style={styles.textInputReadOnly}>
                {user?.phone ?? "Not provided"}
              </Text>
            </View>
          </View>

          {/* Email Input (Read Only) */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconBox}>
              <Mail size={18} color="#94a3b8" />
            </View>
            <View style={styles.inputFlex}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <Text style={styles.textInputReadOnly}>
                {user?.phone ?? "Not provided"}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.saveBtn,
              pressed && styles.saveBtnPressed,
              saving && styles.saveBtnDisabled,
            ]}
          >
            <Text style={styles.saveBtnText}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerBlock: {
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 70, // Extra padding for avatar overlap
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    position: "absolute",
    top: -50,
    right: -40,
  },
  bgCircle2: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "absolute",
    bottom: -30,
    left: -40,
  },
  headerSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  headerBtnPressed: {
    opacity: 0.8,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -(AVATAR / 2 + 10),
    zIndex: 10,
    position: "relative",
    marginBottom: 20,
  },
  avatarRing: {
    width: AVATAR + 12,
    height: AVATAR + 12,
    borderRadius: (AVATAR + 12) / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarImage: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
  },
  avatarPlaceholder: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 4,
    right: "50%",
    marginRight: -((AVATAR + 12) / 2) + 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ORANGE,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarEditBadgePressed: {
    backgroundColor: "#ea580c",
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.2,
    marginLeft: 8,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  inputIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  inputFlex: {
    flex: 1,
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 2,
  },
  textInput: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "600",
    padding: 0,
    margin: 0,
  },
  textInputReadOnly: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 16,
    shadowColor: ORANGE,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  saveBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
