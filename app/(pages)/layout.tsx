import { Container } from "@radix-ui/themes";
import BreadCrumb from "@/components/breadCrumb/BreadCrumbWrapper";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="4" className="!m-0 !p-0  min-h-screen">
      <BreadCrumb />
      {children}
    </Container>
  );
}
