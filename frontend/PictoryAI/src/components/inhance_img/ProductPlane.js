import TitleAndInputField from "./TitleAndInputField";
import CategoryGroupAudience from "./CategoryGroupAudience";
import TitleAndTextArea from "./TitleAndTextArea";

function ProductPlane({ settings, updateSetting }) {
    return (
        <div className='ProductPlane d-flex flex-column'>
            <TitleAndInputField
                title={'Product Name:'}
                placeholder={'Example: Royal Jasmine perfume'}
                value={settings.productName}
                onChange={(v) => updateSetting("productName", v)}
            />
            <CategoryGroupAudience
                selected={settings.audience}
                onChange={(v) => updateSetting("audience", v)}
            />
            <TitleAndTextArea
                title={'Short description (optional)'}
                placeholder={'Example: A luxurious perfume with floral and amber notes'}
                value={settings.productDescription}
                onChange={(v) => updateSetting("productDescription", v)}
            />
            <TitleAndTextArea
                title="Describe the image in your own words"
                placeholder="Describe your idea... e.g. a perfume placed on the beach in a basket"
                value={settings.extraPrompt}
                onChange={(v) => updateSetting("extraPrompt", v)}
            />
        </div>
    );
}

export default ProductPlane;