import { PageIntro } from "@/components/ui/PageIntro/PageIntro";
import { Reveal } from "@/components/ui/Reveal/Reveal";

export function LocalizedIntroPage({ description, eyebrow, title }: { description: string; eyebrow: string; title: string }) {
  return <Reveal><PageIntro description={description} eyebrow={eyebrow} title={title} /></Reveal>;
}
