export const Dropdown = ({ options }) => {

    return (
        <ul className="dropdown">
            {options.map((option, index) => (
                <>
                    {index === options.length - 1 && <hr />}
                    <li
                        key={option.value}
                        onClick={option.onClick}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        {option.label}
                    </li>
                </>
            ))}
        </ul>
    );
};