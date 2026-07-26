import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StatusView } from "@/components/status/StatusView";

export default function StatusDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        <StatusView idOrPublicId={decodeURIComponent(params.id)} />
      </main>
      <Footer />
    </>
  );
}
