import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MiniCard = ({ theme, title, value, icon }) => {
  return (
    <div className={'mini-card mb-3 ' + theme}>
      <FontAwesomeIcon
        icon={icon}
        style={{ fontSize: 24, height: 32, marginRight: 6 }}
      />
      <div className="txt">
        <div className="text-bold fs-4">{value}</div>
        <p>{title}</p>
      </div>
    </div>
  );
};
