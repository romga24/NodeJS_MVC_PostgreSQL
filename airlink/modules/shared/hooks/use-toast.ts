import { toast } from "sonner"

export const useToast = () => {
  return {
    toast,
    success: (message: string, options = {}) => toast.success(message, options),
    error: (message: string, options = {}) => toast.error(message, options),
    warning: (message: string, options = {}) => toast.warning(message, options),
    info: (message: string, options = {}) => toast.info(message, options),
  }
}

