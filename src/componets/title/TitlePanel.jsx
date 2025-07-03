const Title = ({ title, subtitle }) => (
  <>
  <div className="self-stretch p-4 inline-flex justify-between items-start flex-wrap content-start">
    <div className="min-w-72 inline-flex flex-col justify-start items-start">
      <h1 className="justify-start text-neutral-900 text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-10">{title}</h1>
    </div>
  </div>
  </>
);
const Subtitle = ({ subtitle }) => (
  <div className="self-stretch p-4 inline-flex justify-between items-start flex-wrap content-start">
    <div className="min-w-72 inline-flex flex-col justify-start items-start">
      <h2 className="self-stretch justify-start text-stone-800 text-left text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-snug">{subtitle}</h2>
    </div>
  </div>
);
const TitlePanel = {
  Title,
  Subtitle
} 

export default TitlePanel;
