const Title = ({ title, subtitle }) => (
  <div className="p-4">
    <h1 className="text-neutral-900 text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-10">{title}</h1>
  </div>
);

const Subtitle = ({ subtitle }) => (
  <div className="p-4">
    <h2 className="text-stone-800 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-snug">{subtitle}</h2>
  </div>
);
const TitlePanel = {
  Title,
  Subtitle
} 

export default TitlePanel;
