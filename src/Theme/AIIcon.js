import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

const SIZE = {
  SMALL: "small",
  STANDARD: "standard",
};
export const AIIcon = React.memo(({ size, color, opacity, onClick }) => {
  const getWidth = (size) => {
    switch (size) {
      case SIZE.SMALL:
        return "12";
      case SIZE.STANDARD:
        return "14";
      default:
        return "14";
    }
  };
  const getHeight = (size) => {
    switch (size) {
      case SIZE.SMALL:
        return "12";
      case SIZE.STANDARD:
        return "14";
      default:
        return "15";
    }
  };

  const handleClick = (e) => {
    /*
			We only want to stop propagation if onClick is set i props
			otherwise we want the click to propagate up
		*/
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };
  return (
    <StyledSpan
      onClick={handleClick}
      width={getWidth(size)}
      height={getHeight(size)}
    >
      <svg
        width={getWidth(size)}
        height={getHeight(size)}
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.588 3.95c.78 0 1.412.654 1.412 1.463v5.123c0 .809-.632 1.464-1.412 1.464H1.412C.632 12 0 11.345 0 10.536V5.413C0 4.604.632 3.95 1.412 3.95zM8.824 6.62c-.748 0-1.355.63-1.355 1.405 0 .36.134.683.348.931H9.83a1.42 1.42 0 00.347-.93c0-.777-.606-1.406-1.354-1.406zm-5.647 0c-.748 0-1.355.63-1.355 1.405 0 .36.133.683.347.931h2.015a1.42 1.42 0 00.347-.93c0-.777-.606-1.406-1.354-1.406zM7.462 0c.755 0 1.403.502 1.613 1.21a.896.896 0 00-.522.515.225.225 0 00.42.16.445.445 0 01.46-.28c.643.118 1.141.616 1.262 1.245h-9.39a1.57 1.57 0 011.258-1.244.446.446 0 01.463.28.225.225 0 00.421-.16.896.896 0 00-.474-.501c-.015-.007-.032-.01-.047-.016A1.685 1.685 0 014.538 0c.377 0 .743.128 1.039.363a.225.225 0 01.085.176v.57a.337.337 0 00.676 0v-.57c0-.069.031-.134.085-.176A1.674 1.674 0 017.463 0z"
          fill={color}
          fillRule="evenodd"
          opacity={opacity}
        />
      </svg>
    </StyledSpan>
  );
});

AIIcon.SIZE = SIZE;
AIIcon.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number,
  size: PropTypes.oneOf([SIZE.SMALL, SIZE.STANDARD]),
};

AIIcon.defaultProps = {
  opacity: 1,
};
export const StyledSpan = Styled.span`
	display: flex;
	height: ${(props) => props.height + "px"};
	width: ${(props) => props.width + "px"};
	align-self: center;
`;
