function TitleAndTextArea({ title, placeholder, value, onChange }) {
    return (
        <div className='title-and-text-area m-3 d-flex flex-column'>
            <p>{title}</p>
            <textarea
                className='input-fields p-1'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default TitleAndTextArea;