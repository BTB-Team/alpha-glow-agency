import AboutFounder from "../components/about/AboutFounder";
import AboutHero from "../components/about/AboutHero";
import AboutMissionVision from "../components/about/AboutMissionVision";
import AboutStory from "../components/about/AboutStory";
import AboutCTA from "../components/AboutCTA";
import AboutStats from "../components/home/AboutStats";

export default function About() {
  return (
    <>
      <AboutHero />
      <AboutStory/>
      <AboutMissionVision/>
      <AboutFounder/>
      <AboutCTA/>
    </>
  );
}