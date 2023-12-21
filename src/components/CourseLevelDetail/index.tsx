import React, { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Button, Checkbox, Input } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Obj } from '@/global/interface';
import { useUpdateLevelCourse } from '@/utils/hooks';
import { useHookMessage } from '@/utils/hooks/message';
import styles from '@/styles/course/ManagerCourse.module.scss';

interface Props {
    data?: Obj;
}
const validationSchema = yup.object({
    levelName: yup.string().required('Thiếu tên cấp độ!'),
    levelCode: yup.string().required('Thiếu mã cấp độ!'),
});
const CourseLevelDetail = (props: Props) => {
    const message = useHookMessage();
    const updateCourseLevel = useUpdateLevelCourse();
    const refData = useRef<Obj | null>(null);
    const { values, touched, errors, handleBlur, handleChange, handleReset, handleSubmit, setValues, setFieldValue } = useFormik({
        initialValues: props.data ?? {},
        validationSchema,
        onSubmit(values) {
            const newValues = {
                ...values
            }
            delete newValues._id;
            updateCourseLevel.query(newValues, values._id);
        }
    });
    useEffect(() => {
        if (updateCourseLevel.data.response) {
            message.open({
                content: updateCourseLevel.data.response.message as string,
                type: updateCourseLevel.data.success ? 'success' : 'error'
            });
            updateCourseLevel.clear?.();
            message.close();
        }
    }, [updateCourseLevel.data]);
    useEffect(() => {
        if (!refData.current) {
            refData.current = values;
        }
    }, [values])
    return (
        <div className={styles.detailCourseLevel}>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>
                        Hình ảnh:
                    </Form.Label>
                    <Input size="small" name='levelImage' value={values.levelImage} onChange={handleChange} onBlur={handleBlur} />
                </Form.Group>
                <Form.Group className={styles.itemForm}>
                    <Form.Label>Trạng thái:</Form.Label>
                    <Checkbox.Group value={values.active ? ['ACTIVE'] : []} onChange={(checkedValue) => {
                        setFieldValue('active', checkedValue.includes('ACTIVE'));
                    }}>
                        <Checkbox style={{ marginLeft: '0.4rem' }} value={'ACTIVE'}>Active</Checkbox>
                    </Checkbox.Group>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mã <span className='error'>*</span>:
                    </Form.Label>
                    <Input size="small" name='levelCode' value={values.levelCode} onChange={handleChange} onBlur={handleBlur} />
                    {touched.levelCode && errors.levelCode && <p className="error">{errors.levelCode as string}</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Tên cấp độ<span className='error'>*</span>:
                    </Form.Label>
                    <Input size="small" name='levelName' value={values.levelName} onChange={handleChange} onBlur={handleBlur} />
                    {touched.levelName && errors.levelName && <p className="error">{errors.levelName as string}</p>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Thứ tự cấp độ:
                    </Form.Label>
                    <Input size="small" type="number" name='levelNumber' value={values.levelNumber} onChange={handleChange} onBlur={handleBlur} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Mô tả:
                    </Form.Label>
                    <Input size="small" name='levelDescription' value={values.levelDescription} onChange={handleChange} onBlur={handleBlur} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Tài liệu:
                    </Form.Label>
                    <Input size="small" name='textbook' value={values.textbook} onChange={handleChange} onBlur={handleBlur} />
                </Form.Group>
                <div className={styles.btnAction}>
                    <Button onClick={handleReset} disabled={updateCourseLevel.data.isLoading}>Reset</Button>
                    <Button htmlType="submit" loading={updateCourseLevel.data.isLoading} disabled={JSON.stringify(refData.current) === JSON.stringify(values)}>Cập nhật</Button>
                </div>
            </Form>
        </div>
    )
}

export default CourseLevelDetail;