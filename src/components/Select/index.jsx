import './index.css'

const SelectOption = ({ options, selectedId, onChange, isLocked }) => (
  <div className="select-wrapper">
    <svg className="select-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
    <select
      className="select-input"
      value={selectedId || ''}
      onChange={e => onChange(e.target.value)}
      disabled={isLocked}
    >
      <option value="" disabled hidden>Select an option</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>
          {opt.text}
        </option>
      ))}
    </select>
  </div>
)

export default SelectOption
