import { useAppSelector } from "@/hooks/useAppSelector";
import { apiSlice } from "@/redux/api-slice";
import { logout, setTokens } from "@/redux/auth/auth-slice";
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
    // await getCustomer(null).then((res) => {
    //   if (res.data?.code === 200) {
    //     dispatch(
    //       setUserInfo({
    //         email: res.data.result.email,
    //         phone_number: res.data.result.phoneNumber,
    //       })
    //     );
    //   }
    // });

    router.replace("/");
  };

  const logOutUser = async () => {
    try {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());

      // Optionally, make an API request to invalidate the session
      // await api.logout();
    } catch (error) {
      console.log("Logout failed", error);
      // Optionally show a message to the user
    }
  };

  return {
    authorized,
    accessToken,
    logOutUser,
    setUser,
  };
};

export default useAuth;
