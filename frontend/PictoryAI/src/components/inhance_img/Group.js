
import CardWithImg from "./CardWithImg";
import '../../../css/inhance_img/GroupStyle.css'
function Group({title , array , imgWidth , colsNum , selected , onClick})
{
    return(
        <div className='m-3'>
            <p>{title}</p>
            <div className='group' style={{ gridTemplateColumns: `repeat(${colsNum}, 1fr)` }}>
                {array.map((elm, index) => (
                    <CardWithImg
                        key={index}
                        img={elm.image}
                        label={elm.name}
                        selected={selected===elm.name}
                        onClick={()=>onClick(elm.name)}
                        imgWidth={imgWidth}
                    />
                ))}
            </div>
        </div>
    );


}

export default Group;