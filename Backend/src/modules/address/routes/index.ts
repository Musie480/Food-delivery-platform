import { Router } from "express";
import { authenticate } from "../../../middleware/auth.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { listAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/index.js";
import { searchPlaces, reverseGeocode } from "../controllers/geocode.js";

const router = Router();

router.get("/", authenticate, catchAsync(listAddresses));
router.post("/", authenticate, catchAsync(createAddress));
router.put("/:id", authenticate, catchAsync(updateAddress));
router.delete("/:id", authenticate, catchAsync(deleteAddress));
router.put("/:id/default", authenticate, catchAsync(setDefaultAddress));

router.get("/search", authenticate, catchAsync(searchPlaces));
router.get("/reverse", authenticate, catchAsync(reverseGeocode));

export default router;
