import type { Section } from "@/lib/block-schema";
import { HeroBlock } from "./blocks/HeroBlock";
import { RichTextBlock } from "./blocks/RichTextBlock";
import { ImageTextBlock } from "./blocks/ImageTextBlock";
import { CourseGridBlock } from "./blocks/CourseGridBlock";
import { TeacherGridBlock } from "./blocks/TeacherGridBlock";
import { TestimonialGridBlock } from "./blocks/TestimonialGridBlock";
import { StatisticsBlock } from "./blocks/StatisticsBlock";
import { FaqBlock } from "./blocks/FaqBlock";
import { CtaBlock } from "./blocks/CtaBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { GalleryBlock } from "./blocks/GalleryBlock";
import { ExamCountdownBlock } from "./blocks/ExamCountdownBlock";
import { SpacerBlock } from "./blocks/SpacerBlock";
import { Reveal } from "./Reveal";

// Block types that should NOT be wrapped in a scroll-reveal (hero handles
// its own load-in animation; spacer is purely structural).
const NO_REVEAL = new Set(["hero", "spacer"]);

/**
 * Renders an array of Page Builder sections on the public site.
 * Skips hidden sections. Maps each block type to its renderer.
 * Non-hero blocks are wrapped in <Reveal> for the scroll-in animation.
 */
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections
        .filter((s) => !s.hidden)
        .map((section) => {
          let block: React.ReactNode = null;
          switch (section.type) {
            case "hero":
              block = <HeroBlock data={section.data} />;
              break;
            case "richText":
              block = <RichTextBlock data={section.data} />;
              break;
            case "imageText":
              block = <ImageTextBlock data={section.data} />;
              break;
            case "courseGrid":
              block = <CourseGridBlock data={section.data} />;
              break;
            case "teacherGrid":
              block = <TeacherGridBlock data={section.data} />;
              break;
            case "testimonialGrid":
              block = <TestimonialGridBlock data={section.data} />;
              break;
            case "statistics":
              block = <StatisticsBlock data={section.data} />;
              break;
            case "faq":
              block = <FaqBlock data={section.data} />;
              break;
            case "cta":
              block = <CtaBlock data={section.data} />;
              break;
            case "video":
              block = <VideoBlock data={section.data} />;
              break;
            case "gallery":
              block = <GalleryBlock data={section.data} />;
              break;
            case "examCountdown":
              block = <ExamCountdownBlock data={section.data} />;
              break;
            case "spacer":
              block = <SpacerBlock data={section.data} />;
              break;
            default:
              return null;
          }

          if (NO_REVEAL.has(section.type)) {
            return <div key={section.id}>{block}</div>;
          }

          // Grid blocks get a stagger reveal so cards animate in sequence.
          const stagger = ["courseGrid", "teacherGrid", "testimonialGrid", "gallery"].includes(
            section.type
          );
          return (
            <Reveal key={section.id} stagger={stagger}>
              {block}
            </Reveal>
          );
        })}
    </>
  );
}
