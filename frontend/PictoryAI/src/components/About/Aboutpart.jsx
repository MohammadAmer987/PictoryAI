
import "../../css/AboutPart.css"
import logo from '../../images/logo.png'

function Aboutpart(){

    return(
        <>
            <div className={"top-About"}>
                <div className={"about-img"}>
                    <img src={logo} alt="logo" className={'logo-About'}/>
                </div>
                <div>
                    <p className={"Text-About"}><h3 className={"Pictory-txt"}>Pictory AI</h3>
                        <p className="about-p">
                            The AI Product Marketing Assistant is an innovative web application specifically
                            designed to empower small business owners by revolutionizing their online product
                            presentation. Recognizing that many entrepreneurs struggle with the costs and
                            complexity of high-end photography and copywriting, our platform provides an
                            automated solution that transforms standard product photos into professional
                            marketing assets using advanced AI tools.

                            Beyond simple enhancement, our system enables users to generate themed visuals
                            for occasions like Ramadan or Summer, create customized branding with logos and
                            specific color palettes, and produce engaging marketing captions tailored to
                            their target audience.

                            By integrating image generation with smart content creation, we offer a
                            comprehensive toolkit that allows businesses  to save time and build a compelling
                            brand identity with ease.
                        </p>

                    </p>
                </div>



            </div>

        </>

    );
}
export default Aboutpart