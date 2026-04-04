import '../../../css/inhance_img/CardWithImgStyle.css'
function CardWithImg({img, label, selected, onClick, imgWidth})
{
    return(
        <div
            className={`card ${selected ? "active" : ""}`}
            onClick={onClick}
        >
            <div className='img'>
                <img src={img} alt={label} style={{width: imgWidth}}/>
            </div>

            <p className='m-0'>{label}</p>
        </div>
    );
}

export default CardWithImg;