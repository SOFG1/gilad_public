import React from 'react'
import styled from "styled-components"
import { IProps } from "./types"
import LogoutPic from '../../assets/svg/logout-logo.svg'

const StyledBtn = styled.button`
    height: 30px;
    width: 30px;
    background-image: url(${LogoutPic});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    transition: opacity 200ms linear;
    &:hover {
        opacity: .65;
    }
`

const LogoutButton = React.memo(({className, onClick}: IProps) => {
    return <StyledBtn onClick={onClick} className={className} />
})

export default LogoutButton