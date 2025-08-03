import useAuth from "@/hooks/useAuth";
import { useCustomToast } from "@/hooks/useToast";
import { useGoogleLoginMutation, useSendOTPMutation } from "@/services/auth/auth-adapter";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StatusBar, Text } from "react-native";
import * as yup from "yup";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { Input, InputField } from "../ui/input";
import { VStack } from "../ui/vstack";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^(\+98|98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .required("وارد کردن شماره موبایل الزامی است"),
});

interface FormData {
  phoneNumber: string;
}

interface OTPFormProps {
  handleAnimate: (val: string) => void;
}

const LoginForm: React.FC<OTPFormProps> = ({ handleAnimate }) => {
  const [gLogin, { isLoading }] = useGoogleLoginMutation();
  const { setUser } = useAuth();
  const [sendOTP, { isLoading: isLoadingOTP }] = useSendOTPMutation();
  const toast = useCustomToast();
  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken; // fixed path, not userInfo.data.idToken
      if (!idToken) throw new Error("توکنی دریافت نشد");

      const result = await gLogin({ token: idToken }).unwrap();
      setUser({ accessToken: result.token });
      // Handle result (e.g., store user/token, navigate)
    } catch (error) {
      toast.show({ type: "error", msg: "خطایی رخ داده است" });
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const normalizePhoneNumber = (phoneNumber: string): string => {
    // Remove +98, 98, or 0 from the start, and keep the remaining 10 digits
    return phoneNumber.replace(/^(\+98|98|0)/, "").slice(-10);
  };

  const onSubmit = (data: FormData) => {
    const normalizedPhoneNumber = normalizePhoneNumber(data.phoneNumber);
    sendOTP({ phoneNumber: normalizedPhoneNumber })
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.success) {
          console.log(res);
          handleAnimate(normalizedPhoneNumber);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.show({ type: "error", msg: err.data.message || "خطایی رخ داده است" });
      });
  };

  return (
    <VStack className="w-full">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text className="text-3xl font-bold text-gray-800 text-center mb-2" style={{ fontFamily: "vazirBold" }}>
        خوش آمدید
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8" style={{ fontFamily: "vazir" }}>
        برای ورود شماره موبایل خود را وارد کنید
      </Text>

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, value } }) => (
          <VStack className="mb-4">
            <Input
              className={`border h-12 rounded-lg bg-white text-base text-gray-800 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            >
              <InputField
                placeholder="شماره موبایل را وارد کنید"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                className=" text-center"
                style={{ fontFamily: "vazir" }}
              />
            </Input>
            {errors.phoneNumber && (
              <Text className="text-red-500 text-sm mt-1 text-right" style={{ fontFamily: "vazir" }}>
                {errors.phoneNumber.message}
              </Text>
            )}
          </VStack>
        )}
      />

      <Button className="rounded-lg p-3 bg-primary-600 mt-4" onPress={handleSubmit(onSubmit)}>
        <ButtonText className="text-white text-base font-semibold" style={{ fontFamily: "vazirBold" }}>
          {isLoadingOTP ? <ButtonSpinner /> : "    دریافت کد تایید"}
        </ButtonText>
      </Button>

      {/* <HStack className="items-center w-full my-6">
        <Divider className="flex-1 bg-gray-300 h-px" />
        <Text className="text-gray-600 mx-4" style={{ fontFamily: "vazir" }}>
          یا
        </Text>
        <Divider className="flex-1 bg-gray-300 h-px" />
      </HStack>

      <VStack className="w-full">
        {!isLoading ? (
          <GoogleSigninButton style={{ width: "100%", height: 48, marginBottom: 16 }} onPress={signInWithGoogle} />
        ) : (
          <Button>
            <ButtonSpinner />
          </Button>
        )}
      </VStack> */}
    </VStack>
  );
};

export default LoginForm;
