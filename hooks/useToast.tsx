import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";

export const useCustomToast = () => {
  const toast = useToast();
  const show = ({
    type,
    msg,
    placement,
    title,
  }: {
    type?: "success" | "error";
    msg: string;
    placement?: any;
    title?: string;
  }) => {
    toast.show({
      placement: placement || "bottom",

      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast
            style={{ alignSelf: "center", marginBottom: 76 }}
            className={
              type === "success"
                ? "bg-white border border-success-300 flex-row  items-center"
                : "bg-error-100 border border-error-300 flex-row items-center"
            }
            nativeID={uniqueToastId}
            action={type}
            variant="outline"
          >
            <VStack>
              {title && (
                <ToastTitle className="font-vazirBold">{title}</ToastTitle>
              )}
              <ToastDescription className="font-vazir text-right flex-1">
                {msg}
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };
  return {
    show,
  };
};
