import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { useRouter } from 'next/router';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { getStringResourceApply, getStringStatusProcess } from '@/global/init';
import { ComponentPage, KEY_ICON, ResourceApply, StatusProcessing } from '@/global/enum';
import { Obj } from '@/global/interface';
import { MapIconKey } from '@/global/icon';
import CombineRoute from '@/global/route';
import { useDebounce, useDispatchDataRouter, useGetArea, useGetListCourse, useGetListDataRecruitment } from '@/utils/hooks';
import Dropdown from '@/components/Dropdown';
import styles from '@/styles/Recruitment/ManagerRecruitment.module.scss';
import { ContextRecruitment } from '../context';

interface Props {
    onImport?: () => void;
    onCreate?: () => void;
    setIsSearching?: (search: boolean) => void;
}

const FilterBar = (props: Props) => {
    const router = useRouter();
    const area = useGetArea();
    const { pagination, conditionFilter, setIsSearch } = useContext(ContextRecruitment);
    const listDataRecruitment = useGetListDataRecruitment();
    const getAreas = area.data.response?.data as Obj[];
    const candidate = useGetListDataRecruitment();
    const firstRender = useRef<boolean>(true);

    const [searchEmail, setSearchEmail] = useState<string>('');

    const searchCandidate = useDebounce(searchEmail, 500);
    const listStatus = Object.keys(StatusProcessing).map((item) => {
        return {
            label: getStringStatusProcess[item as StatusProcessing],
            value: item
        }
    });
    const listResourseApply = Object.keys(ResourceApply).map((item) => {
        return {
            label: getStringResourceApply[item as ResourceApply],
            value: item
        }
    });
    const listCourse = useGetListCourse();
    const getListCourse = (listCourse.listCourse as Obj)?.data as Obj[];
    const listFieldFilter = [
        {
            label: 'Khu vực',
            field: 'area',
            value: [
                {
                    label: 'Tất cả',
                    value: 'ALL'
                },
                ...getAreas ? getAreas.map((item) => {
                    return {
                        label: item.name,
                        value: item._id
                    }
                }) : []
            ]
        },
        {
            label: 'Sắp xếp',
            field: 'sort',
            value: [
                {
                    label: 'Mới nhất',
                    value: 'ASC'
                },
                {
                    label: 'Cũ nhất',
                    value: 'DESC'
                },
            ]
        },
        {
            label: 'Trạng thái',
            field: 'status',
            value: [
                {
                    label: 'Tất cả',
                    value: 'ALL',
                },
                ...listStatus
            ]
        },
        {
            label: 'Nguồn tuyển',
            field: 'resourceHunt',
            value: [
                {
                    label: 'Tất cả',
                    value: 'ALL'
                },
                ...listResourseApply
            ]
        },
        {
            label: 'Bộ môn',
            field: 'courseApply',
            value: [
                {
                    label: 'Tất cả',
                    value: 'ALL'
                },
                ...getListCourse ? getListCourse?.map(item => {
                    return {
                        label: item.courseName,
                        value: item._id
                    }
                }) : []
            ]
        }
    ];
    const getIndexToField: Record<string, keyof typeof conditionFilter.condition> = {
        '0': 'area',
        '1': 'sort',
        '2': 'status',
        '3': 'resourceHunt',
        '4': 'courseApply'
    }
    const handleChangeConditionFilter = (field: keyof typeof conditionFilter.condition, value: any) => {
        conditionFilter.setCondition({
            ...conditionFilter.condition,
            [field]: value
        });
    }
    const dispatchRouter = useDispatchDataRouter();
    const handleQueryFilterWithConditional = () => {
        listDataRecruitment.query(pagination.data.currentTotalRowOnPage, pagination.data.currentPage, undefined, conditionFilter.condition)
    }
    useEffect(() => {
        if (!area.data.response) {
            area.query();
        }
    }, [area.data.response]);
    useEffect(() => {
        if (!firstRender.current) {
            setIsSearch(!!searchCandidate);
            listDataRecruitment.query(undefined, undefined, undefined, {
                ...conditionFilter.condition,
                ...searchCandidate ? {
                    valueSearch: searchCandidate
                } : {}
            });
            props.setIsSearching?.(!!searchCandidate);
        }
    }, [searchCandidate]);
    return (
        <div className={styles.filterBar}>
            <div className={styles.listFilter}>
                {
                    listFieldFilter.map((item, idx) => {
                        const getCurrentListValue = item.value;
                        const findMatchingValueWCondition = getCurrentListValue.find((value) => {
                            return conditionFilter.condition[item.field] === value.value;
                        });
                        return <div className={styles.itemFilter} key={idx}>
                            <label>
                                <b>
                                    {item.label}
                                </b>
                            </label>
                            <div className={styles.dropdown}>
                                <Dropdown
                                    trigger="click"
                                    listSelect={item.value?.map((value) => {
                                        return {
                                            key: value.value,
                                            label: value.label
                                        }
                                    })}
                                    icon
                                    title={<span className={styles.labelField}>{findMatchingValueWCondition?.label ?? '--'} {MapIconKey[KEY_ICON.CHEVROND]}</span>}
                                    onClickItem={(e) => {
                                        handleChangeConditionFilter(getIndexToField[idx.toString()], e.key)
                                    }}
                                />
                            </div>
                        </div>
                    })
                }
                <Button size="small" onClick={handleQueryFilterWithConditional}>{MapIconKey[KEY_ICON.SRCH]}</Button>
            </div>
            <div className={styles.fnc}>
                <div className={styles.button}>
                    <Button>Duyệt CSV</Button>
                    <Button onClick={() => {
                        dispatchRouter(CombineRoute['TE']['RECRUITMENT_CREATE_CANDIDATE'], "Tạo ứng viên", "Tạo ứng viên", ComponentPage.RECRUITMENT_CREATE_CANDIDATE, true);
                        router.push(CombineRoute['TE']['RECRUITMENT_CREATE_CANDIDATE']);
                    }}>
                        Tạo ứng viên
                    </Button>
                </div>
                <div className={styles.rightFnc}>
                    <Input
                        placeholder="Tìm kiếm theo email hoặc họ tên ứng viên"
                        prefix={candidate.data.isLoading ? <LoadingOutlined /> : <SearchOutlined />}
                        onChange={(e) => {
                            firstRender.current = false;
                            setSearchEmail(e.target.value);
                        }}
                    />
                    <Button
                        className={`btn-toolbar ${styles.btnReload}`}
                        onClick={handleQueryFilterWithConditional}
                    >
                        <span className={styles.reload}>{MapIconKey[KEY_ICON.RELOAD]}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FilterBar;