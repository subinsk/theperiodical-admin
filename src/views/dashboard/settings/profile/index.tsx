import { Button, InputField, Label, Stack } from "@/components";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react";
import { updateUser } from "@/services/user.service";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/loader";

export const SettingsProfileView = () => {
  // states
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // hooks
  const { data: session, status } = useSession()
  const user = session?.user;

  // functions
  const getButtonText = () => {
    if (isSubmitting) {
      return "Saving...";
    }
    return "Save changes";
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error("User is not defined.");
      }

      const response = await updateUser(user.id, {
        name,
      });

      if (response.success) {
        toast.success(response.message);
      } else throw new Error(response.message);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // effects
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email)
    }
  }, [user])

  return (
    <>
      {status === "authenticated" && (
        <div className="flex flex-col gap-8 px-8">
          <div className="flex gap-8 items-center">
            {user && user.image ? (
              <Image
                alt={user.name || 'User Image'}
                className="h-48 w-48 rounded-full"
                height={192}
                width={192}
                src={user.image}
              />
            ) : (
              <Icon
                icon="radix-icons:avatar"
                className="h-48 w-48 dark:text-white"
              />
            )}
            <div className="grid grid-cols-2 gap-8 mt-12 w-full">
              <div className="grid col-span-1 w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <InputField
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  disabled
                />
              </div>
              <div className="grid col-span-1 w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <InputField
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button className="mt-5 mx-auto" onClick={handleUpdateProfile}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
        </div>
      )}
      {status === "loading" && <Loader />}
    </>
  )
}
