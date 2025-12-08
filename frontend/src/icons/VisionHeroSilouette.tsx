import * as React from "react";
import * as HeroIcons from "./hero";

const heroSilhouetteMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  chatterbait: HeroIcons.ChatterbaitHeroSilhouette,
  // swim_jig: HeroIcons.SwimJigHeroSilhouette,
  // ...
};

interface VisionHeroSilhouetteProps {
  iconKey: string;
  className?: string;
}

export function VisionHeroSilhouette({
  iconKey,
  className,
}: VisionHeroSilhouetteProps) {
  const Icon =
    heroSilhouetteMap[iconKey] ?? HeroIcons.ChatterbaitHeroSilhouette;
  return <Icon className={className} />;
}
