function TitleAndInputField({ title, placeholder, value, onChange }) {
    return (
        <div className='title-and-input-field m-3 d-flex flex-column'>
            <p>{title}</p>
            <input
                className='input-fields p-1'
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default TitleAndInputField;