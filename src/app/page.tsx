import SlideShow from "@/components/SlideShow";
import AboutSlide from "@/components/slides/AboutSlide";
// The ACSM slide is hidden for now. To bring it back, uncomment this import
// and its entry in the slides list below.
// import AcsmSlide from "@/components/slides/AcsmSlide";
import AirQualitySlide from "@/components/slides/AirQualitySlide";
import ParticulateMatterSlide from "@/components/slides/ParticulateMatterSlide";

export default function Home() {
  return (
    <SlideShow
      slides={[
        { title: "Air Quality Index", content: <AirQualitySlide /> },
        { title: "Particulate Matter", content: <ParticulateMatterSlide /> },
        // { title: "ACSM", content: <AcsmSlide /> },
        { title: "About Us", content: <AboutSlide /> },
      ]}
    />
  );
}
