
import PricingCard from "../PricingSection/PricingCard";


function Featurepart(){


    return(

        <>

            <div className={"div-on-tp-feature"}>

            <div className={"F1"}>
       <PricingCard
           image={require("../../images/F1.png")}
           className={"card-style-1"}
           link="/"

       />
        </div>

            <div className={"F2"}>
            <PricingCard
                image="/images/feature1.png"

                className={"card-style-2"}

            />

        </div>
            <div className={"F3"}>
                <PricingCard
                    image="/images/feature1.png"

                    className={"card-style-3"}/>

            </div>

            <div className={"F4"}>
                <PricingCard
                    image="/images/feature1.png"

                    className={"card-style-4"}
                />

            </div>

            </div>

            <br/>
            <br/>
            <br/>   <br/>
            <br/>
            <br/>   <br/>
            <br/>
            <br/>   <br/>
            <br/>
            <br/>
    </>
    );
}


export default Featurepart