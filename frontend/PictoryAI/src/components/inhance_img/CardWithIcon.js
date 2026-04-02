import "../../../css/inhance_img/CardWithIconStyle.css"
function CardWithIcon({icon, label, selected, onClick}){
    return(
        <div
            className={`CategoryCard ${selected ? "active" : ""}`}
            onClick={onClick}
        >
            <div className='icon'>
                {icon}
            </div>

            <p className='m-0'>{label}</p>

        </div>
    );
}

export default CardWithIcon;