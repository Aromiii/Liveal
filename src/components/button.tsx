const Button = (props: { className: string, text: string, onClick?: () => any }) => {
  return <>
    <button onClick={props.onClick} className={`bg-red-500 rounded-lg p-2 text-white text-xl px-5 ${props.className}`}>
      { props.text }
    </button>
  </>;
};

export default Button;