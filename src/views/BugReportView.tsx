import React, { useCallback, useMemo, useRef, useState } from "react";
import { useAppActions } from "../store/app/hooks";
import { Modal } from "../components/Modal";
import styled from "styled-components";
import { Title } from "../components/Title";
import { useTranslation } from "react-i18next";
import { ButtonBox } from "../components/ButtonBox";
import { MainButton } from "../components/MainButton";
import { Textarea } from "../components/Textarea";
import { TextInput } from "../components/TextInput";
import { Dropdown } from "../components/Dropdown";
import { FileInput } from "../components/FileInput";
import { useUserState } from "../store/user/hooks";
import { CriticalityValueType, IReportBugParams, User } from "../api/User";
import { handle } from "../api";

const Content = styled.div`
  padding: 40px 30px 30px;
`;

const StyledAction = styled(MainButton)`
  padding: 11px 0;
  text-align: center;
  width: 150px;
`;

const StyledTextarea = styled(Textarea)`
  textarea {
    resize: vertical;
  }
  margin-bottom: 15px;
`;

const StyledDropdown = styled(Dropdown)`
  margin-bottom: 15px;
`;

const StyledFileInput = styled(FileInput)`
  margin-bottom: 90px;
`;

const BugReportView = React.memo(() => {
  const { t } = useTranslation();
  const { token } = useUserState();
  const { onSetModal, onSetAlert } = useAppActions();
  const [bugDescription, setBugDescription] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [criticality, setCriticality] = useState<CriticalityValueType>("10027");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReport = useCallback(async () => {
    const notFilled =
      !bugDescription.trim() || !steps.trim() || !criticality.trim();
    if (notFilled) {
      onSetAlert(false, t("bug_report-error"));
      return;
    }
    if (token) {
      const data: IReportBugParams = {
        description: bugDescription,
        steps,
        criticality_id: criticality as CriticalityValueType,
        files: fileInputRef?.current?.files as FileList,
      };
      const [dataRes, dataErr] = await handle(User.reportJiraBug(token, data));
      if (!dataErr) {
        onSetAlert(true, t("bug_report-success"));
      }
      if (dataErr) {
        console.log(dataErr);
      }
    }
  }, [bugDescription, steps, criticality, fileInputRef?.current?.files]);

  const criticalityOptions = useMemo(() => {
    return [
      {
        item: t("bug_report-criticality1"),
        value: "10024",
      },
      { item: t("bug_report-criticality2"), value: "10025" },
      { item: t("bug_report-criticality3"), value: "10026" },
      { item: t("bug_report-criticality4"), value: "10027" },
    ]
  }, [t])

  return (
    <Modal onClose={() => onSetModal(null)}>
      <Content>
        <Title>{t("bug_report-title")}</Title>
        <StyledTextarea
          value={bugDescription}
          onChange={setBugDescription}
          label={t("bug_report-description_label")}
          placeholder={t("bug_report-description_plhr")}
        />
        <StyledTextarea
          value={steps}
          onChange={setSteps}
          label={t("bug_report-steps_label")}
          placeholder={t("bug_report-steps_plhr")}
        />
        <StyledDropdown
          label={t("bug_report-criticality_label")}
          placeholder={t("bug_report-criticality_plhr")}
          value={criticality}
          onSelect={setCriticality}
          options={criticalityOptions}
        />
        <StyledFileInput
          ref={fileInputRef}
          text={t("bug_report-files")}
          isMultiple={true}
        />
      </Content>
      <ButtonBox>
        <StyledAction color="orange" onClick={handleReport}>
          {t("bug_report-report")}
        </StyledAction>
        <StyledAction color="blue" onClick={() => onSetModal(null)}>
          {t("bug_report-close")}
        </StyledAction>
      </ButtonBox>
    </Modal>
  );
});

export default BugReportView;
