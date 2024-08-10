const Button = (props) => {
    return (
        <>
            <button type={props.type} onClick={props.onClick} className={`${props.width} ${props.paddingX} ${props.paddingY} text-white hover:text-black rounded-full relative button`}>
                <span className="z-10 relative font-semibold">{props.value}</span>
                <div className="absolute inset-0 bg-black transition-all duration-800"></div>
            </button>
        </>
    )
}
export default Button