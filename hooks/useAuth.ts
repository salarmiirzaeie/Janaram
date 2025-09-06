import { useAppSelector } from "@/hooks/useAppSelector";
import { apiSlice } from "@/redux/api-slice";
import { logout, setAuthorized, setTokens } from "@/redux/auth/auth-slice";
import { setIsFirstModalShow } from "@/redux/intialize/initialize-slice";
import { clearMoods } from "@/redux/mood/mood-slice";
import { router } from "expo-router"; // Move this to the top level
import { useDispatch } from "react-redux";

const useAuth = () => {
  const { authorized, accessToken } = useAppSelector((state) => state.auth);

  const dispatch = useDispatch();

  const setUser = async (val: { accessToken: string }) => {
    dispatch(
      setTokens({
        accessToken: val.accessToken,
      })
    );
  };

  const logOutUser = async () => {
    try {
      dispatch(logout());
      dispatch(clearMoods());
      dispatch(setIsFirstModalShow(true));
      dispatch(apiSlice.util.resetApiState());

      // Optionally, make an API request to invalidate the session
      // await api.logout();
    } catch (error) {
      console.log("Logout failed", error);
      // Optionally show a message to the user
    }
  };
  const setUserAuthorized = async (val: boolean) => {
    dispatch(setAuthorized(val));
    router.replace("/");
  };
  return {
    authorized,
    accessToken,
    logOutUser,
    setUser,
    setUserAuthorized,
  };
};

export default useAuth;
