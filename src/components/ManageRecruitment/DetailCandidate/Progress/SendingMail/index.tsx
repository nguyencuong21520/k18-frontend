import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Obj } from '@/global/interface';
import { RoundProcess, TemplateMail } from '@/global/enum';
import { useRouter } from 'next/router';
import { useGetDetailCandidate, useGetMailTemplate, useMailer, useUpdateDataProcessRoundCandidate } from '@/utils/hooks';
import { useHookMessage } from '@/utils/hooks/message';
import TextEditor from '@/components/TextEditor';
import Send from '@/icons/Send';
import ModalCustomize from '@/components/ModalCustomize';
import styles from '@/styles/Recruitment/ManagerRecruitment.module.scss';

interface Props {
    round?: RoundProcess;
    noConnect?: boolean;
    handleSend?: (subject: string, html: string) => void;
    pass: boolean;
    statusSendMail?: boolean;
    disabled?: boolean;
    roundId?: string;
}

const SendingMail = (props: Props) => {
    const mapRoundToMailTemplate: Record<string, TemplateMail> = {
        [RoundProcess.CV]: TemplateMail.FAILCV,
        [RoundProcess.INTERVIEW]: !props.pass ? TemplateMail.FAILINTERVIEW : TemplateMail.PASSINTERVIEW,
        ...props.noConnect && {
            'NOCONNECT': TemplateMail.NOCONNECT,
        }
    }
    const router = useRouter();
    const getTemplate = mapRoundToMailTemplate[props.round ? props.round : (props.noConnect ? 'NOCONNECT' : '')];
    const [currentTemplate, setCurrentTemplate] = useState<string>(getTemplate);
    const mailTemplate = useGetMailTemplate();
    const dataMailtemplate = mailTemplate.data.response?.data as Obj;
    const updateDataRoundProcessCandidate = useUpdateDataProcessRoundCandidate();

    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');

    const crrCandidate = useGetDetailCandidate();
    const getDataCandidate = crrCandidate.data.response?.data as Obj;

    const [modal, setModal] = useState(false);

    const mailer = useMailer();
    const message = useHookMessage();

    const handleBlur = (newValue: string) => {
        setValue(newValue);
    }
    const handleSubmit = () => {
        mailer.query({
            body: {
                from: "K18",
                toMail: getDataCandidate?.email as string,
                subject: title,
                html: value,
                round: props.round,
                candidateId: getDataCandidate._id as string
            }
        })
    }
    useEffect(() => {
        mailTemplate.query({
            query: {
                template: currentTemplate
            }
        });
    }, [currentTemplate]);
    useEffect(() => {
        const getTemplate = mapRoundToMailTemplate[props.round ? props.round : (props.noConnect ? 'NOCONNECT' : '')];
        setCurrentTemplate(getTemplate);
    }, [props.round, props.pass]);

    useEffect(() => {
        if (dataMailtemplate && getDataCandidate) {
            setTitle(dataMailtemplate.title);
            const example = dataMailtemplate.html ? String(dataMailtemplate.html).replace('NAME', getDataCandidate?.fullName as string).replace('POSITION', `Giáo viên/Trợ giảng ${getDataCandidate?.courseApply.courseName as string}`) : '';
            setValue(example);
        }
    }, [dataMailtemplate, getDataCandidate]);

    useEffect(() => {
        if (mailer.data.response) {
            message.open({
                type: mailer.data.success ? 'success' : 'error',
                content: mailer.data.success ? 'Gửi thành công' : (mailer.data.response.data as Obj)?.message as string
            });
            if (mailer.data.success) {
                setModal(false);
                if (props.round === RoundProcess.INTERVIEW) {
                    updateDataRoundProcessCandidate.query({
                        params: [props.roundId as string],
                        body: {
                            mailResultSent: true,
                            round: RoundProcess.INTERVIEW,
                            candidateId: router.query.candidateId as string
                        }
                    });
                }
            }
            mailer.clear?.();
            message.close();
        }
    }, [mailer, props.roundId]);
    return (
        <div className={styles.sendingMail}>
            <Button size="small" className={styles.btnSentMailCv} onClick={() => { setModal(true) }}>
                <Send className={styles.iconSent} />Gửi mail
                {
                    props.statusSendMail ? <CheckCircleFilled style={{ color: 'var(--success)' }} className={styles.statusSentMail} /> :
                        <CloseCircleFilled style={{ color: 'var(--light-red)' }} className={styles.statusSentMail} />
                }
            </Button>
            {modal &&
                <ModalCustomize
                    size="xl"
                    centered
                    show={modal}
                    onHide={() => {
                        setModal(false);
                    }}
                    modalHeader={<div>Gửi mail tới: {getDataCandidate?.email as string}</div>}
                >
                    <TextEditor
                        title={title}
                        setTitle={setTitle}
                        hasTitle
                        value={value}
                        onBlur={handleBlur}
                        loadingButton={mailer.data.isLoading}
                        textButton="Gửi"
                        handleSubmit={handleSubmit}
                    />
                </ModalCustomize>}
        </div>
    )
}

export default SendingMail;