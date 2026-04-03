import { Row, Col } from 'react-bootstrap';

function SelectionGroup({
  title,
  options,
  activeValue,
  onSelect,
  smCols = 3
}) {
  return (
    <div className="mb-4">
      <label className="text-black  text-start fw-bold small mb-2 d-block text-dark">
        {title}
      </label>

      <Row className="text-black g-2">
        {options.map((opt) => {
          const isActive = activeValue === opt.name;

          return (
            <Col key={opt.name} xs={6} sm={smCols}>
              <div
                onClick={() => onSelect(opt.name)}
                className={`selection-card p-2 rounded-3 text-center d-flex flex-column align-items-center justify-content-center ${
                  isActive ? 'active' : ''
                }`}
                style={{ minHeight: '80px', cursor: 'pointer' }}
              >
                <i
                  className={`bi ${opt.icon} fs-5 mb-1 ${
                    isActive ? 'text-primary-green' : 'text-muted'
                  }`}
                ></i>

                <span className="extra-small fw-semibold">
                  {opt.name}
                </span>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default SelectionGroup;