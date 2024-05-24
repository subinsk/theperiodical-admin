import { Button, InputField, Label, Stack } from "@/components";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import useGetUser from "@/hooks/use-get-user";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/services/user.service";
import toast from "react-hot-toast";

export default function Profile() {
  // states
  const [name, setName] = useState<string>("Subin S K");
  const [phone, setPhone] = useState<string>("8094774065");
  const [email, setEmail] = useState<string>("subinsk284@gmail.com");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // hooks
  const user = useGetUser();

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

      const response = await updateUser(user.id, {
        name,
        phone,
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

  return (
    <div className="flex flex-col gap-8 px-8">
      <div className="flex gap-8 items-center">
        {user && user?.user_metadata?.avatar_url ? (
          <Image
            alt={user?.user_metadata?.name}
            className="h-48 w-48 rounded-full"
            height="20"
            src={user?.user_metadata?.avatar_url}
            width="2"
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
              type="name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid col-span-1 w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <InputField
              type="phone"
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button className="mt-5 mx-auto" onClick={handleUpdateProfile}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {getButtonText()}
      </Button>
    </div>
  );
}
