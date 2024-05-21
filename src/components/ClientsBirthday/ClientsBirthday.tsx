import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { colors } from "../../assets/styles/colors";
import Pic from "../../assets/svg/birthdays-icon.svg";
import { useAppActions } from "../../store/app/hooks";
import { useBirthdaysActions, useBirthdaysState } from "../../store/birthdays";
import EditPic from "../../assets/svg/edit-birthdays.svg";

const Wrapper = styled.div`
  position: relative;
  max-width: 1400px;
  padding: 0 70px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
`;

const BellBtn = styled.button`
  height: 36px;
  width: 36px;
  background-image: url(${Pic});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: opacity 200ms linear;
  &:hover {
    opacity: 0.65;
  }
`;


const Window = styled.div`
  position: absolute;
  right: 35px;
  top: 125%;
  display: inline-block;
  padding: 10px 16px 18px;
  background: #ffffff;
  border: 1px solid #c2fffd;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  &::after {
    content: "";
    position: absolute;
    top: -11px;
    right: 40px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 12.5px 12px 12.5px;
    border-color: transparent transparent #ffffff transparent;
    filter: drop-shadow(0px -1px 0px #c2fffd);
    z-index: 1;
  }
`;

const Title = styled.p`
  font-family: "Open Sans";
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  color: ${colors.graphite_6};
`;

const ClientsBox = styled.table`
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;

const StyledClient = styled.tr`
  margin-bottom: 35px;
`;

const StyledData = styled.td`
  font-weight: 400;
  padding: 2px 5px;
  line-height: 19px;
  color: ${colors.graphite_4};
`;

const EditBtn = styled.button`
  height: 36px;
  width: 36px;
  border: 0;
  background-color: transparent;
  background-image: url(${EditPic});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  align-self: center;
  cursor: pointer;
  transition: opacity 200ms linear;
  margin-inline-end: 25px;
  &:hover {
    opacity: 0.65;
  }
`;

const ClientsBirthday = React.memo(() => {
  const { t } = useTranslation();
  const {todayBirthdays} = useBirthdaysState()
  const {onGetTodayBDays} = useBirthdaysActions()
  const {onSetModal} = useAppActions()
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onGetTodayBDays();
    document.addEventListener("click", handleDismiss);
    return () => document.removeEventListener("click", handleDismiss);
  }, []);

  useEffect(() => {
    if (todayBirthdays?.length > 0) setIsOpen(true);
  }, [todayBirthdays]);

  const handleDismiss = (e: any) => {
    if (e.target.closest(".clients-birthday__btn")) {
      setIsOpen((opened) => !opened);
      return;
    }
    if (!e.target.closest(".clients-birthday__window")) setIsOpen(false);
  };

  return (
    <Wrapper>
        <EditBtn onClick={() => onSetModal("birthdays-editor")} />
      {todayBirthdays.length > 0 && (
        <>
          <BellBtn className="clients-birthday__btn" />
          {isOpen && (
            <Window className="clients-birthday__window">
              <Title>{t("clients_birthday")}</Title>
              <ClientsBox>
                <tbody>
                  {todayBirthdays.map((bday: any, index) => {
                    const keys = Object.keys(bday);
                    return (
                      <StyledClient key={index}>
                        {keys.map((key: string, i) => {
                          if (key === "day" || key === "month") return null;
                          return <StyledData key={i}>{bday[key]}</StyledData>;
                        })}
                      </StyledClient>
                    );
                  })}
                </tbody>
              </ClientsBox>
            </Window>
          )}
        </>
      )}

    </Wrapper>
  );
});

export default ClientsBirthday;
