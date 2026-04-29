import { showAd } from "@/components/home/BannerAd";
import { usePlansQuery } from "@/services/upgrade/upgrade-adapter";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const usePro = () => {
  const { data: plans } = usePlansQuery(null);

  const dispatch = useDispatch();
  const isProActive =
    plans?.data?.plans?.some((p) => p.name === "unlimited" && p.isActive) ??
    false;
  const showInterstitial = useCallback(() => {
    if (isProActive) return;
    showAd();
  }, [isProActive]);
  const handleOpenNotProModal = useCallback(() => {
    dispatch({
      type: "pro/setShowNotProModal",
      payload: {
        message: "🌙 این مدیتیشن مخصوص کاربران Pro است",
        showNotProModal: true,
      },
    });
  }, [dispatch]);

  return { handleOpenNotProModal, isProActive, showInterstitial };
};
