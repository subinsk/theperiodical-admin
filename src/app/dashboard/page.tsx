import { Card, CardContent, Stack, Typography } from "@/components";
import Link from "next/link";
import { IoNewspaperOutline } from "react-icons/io5";

export default function Page(): JSX.Element {
  const items = [
    {
      title: "Gists",
      icon: <IoNewspaperOutline className="h-8 w-8" />,
      href: "/dashboard/gists",
    },
  ];
  return (
    <Stack direction="row" wrap="wrap" gap={4}>
      {items.map((item, index) => (
        <Link href={item.href} key={index}>
          <Card className="w-[250px] h-[180px] shadow-sm cursor-pointer transition-all duration-200 ease-in-out transform hover:shadow-lg">
            <CardContent className="p-4">
              <Stack direction="row" align="center" gap={3}>
                {item.icon}
                <Typography variant="h3">{item.title}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Stack>
  );
}
