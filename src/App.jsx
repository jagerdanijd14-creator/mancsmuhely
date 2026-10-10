<input
  type="date"
  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  }}
  onClick={(e) => {
    if (typeof e.target.showPicker === 'function') {
      e.target.showPicker();
    }
  }}
  style={{
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #8C7A70',
    backgroundColor: 'white',
    color: '#4A3B32',
    fontSize: '16px',
    outline: 'none',
    cursor: 'pointer'
  }}
/>
