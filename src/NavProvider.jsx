import PropTypes from 'prop-types';
import { createContext, useState, useEffect,useRef } from 'react';
import NavContext from './NavContext';
import { useNavigate } from 'react-router-dom';


const NavProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isDropdownHovered, setIsDropdownHovered] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    const EnterButton = () => {
        setIsButtonHovered(true);
        setIsOpen(true);
    };

    const LeaveButton = () => {
        setIsButtonHovered(false);
    };

    const EnterDropdown = () => {
        setIsDropdownHovered(true);
    };

    const LeaveDropdown = () => {
        setIsDropdownHovered(false);
    };

    const CategoryHover = (category) => {
        setHoveredCategory(category);
        setIsOpen(true);
    };

    const CategoryLeave = () => {
        setHoveredCategory(null);
        setIsOpen(true);
    };

    const handleSubcategoryClick = (subcategoryId) => {
        navigate('/products', {
            state: { selectedSubcategory: subcategoryId }
        });
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            !event.target.closest("#dropdown-button") &&
            !event.target.closest("#dropdown-menu") &&
            !event.target.closest(".subcategory-item")
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isButtonHovered || isDropdownHovered) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [isButtonHovered, isDropdownHovered]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const originalContent = scrollContainer.innerHTML;
        scrollContainer.innerHTML += originalContent;

        scrollContainer.style.whiteSpace = 'nowrap';
        scrollContainer.style.overflowX = 'hidden';

        const scrollSpeed = 0.8; 
        const scrollInterval = 1000 / 60; 
        let scrollPosition = 0;
        const containerWidth = scrollContainer.clientWidth;
        const scrollWidth = scrollContainer.scrollWidth;

        const autoScroll = () => {
            scrollPosition += scrollSpeed;

            if (scrollPosition >= scrollWidth / 2) {
                scrollPosition = 0;
            }

            scrollContainer.scrollLeft = scrollPosition;

            requestAnimationFrame(autoScroll); 
        };

        requestAnimationFrame(autoScroll);

        return () => {
            cancelAnimationFrame(autoScroll);
        };
    }, []);
    

    return (
        <NavContext.Provider value={{
            isOpen,
            EnterButton,
            LeaveButton,
            EnterDropdown,
            LeaveDropdown,
            hoveredCategory,
            CategoryHover,
            scrollContainerRef,
            handleSubcategoryClick
        }}>
            {children}
        </NavContext.Provider>
    );
};

NavProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export default NavProvider;
