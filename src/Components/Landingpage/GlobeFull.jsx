import Globe from "@/Components/ui/Globe";

export default function GlobeF() {
  return (
    <section className="relative h-[600px] w-full flex items-center justify-center">
      <Globe
        className="absolute -bottom-40 right-0"
        width={500}
        height={500}
        markers={[
          { location: [48.8566, 2.3522], size: 0.05 }, // Paris
          { location: [35.6895, 139.6917], size: 0.08 }, // Tokyo
        ]}
      />
    </section>
  );
}
