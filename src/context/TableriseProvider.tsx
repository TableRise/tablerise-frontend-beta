import { useMemo, useState } from 'react';
import TableriseContext from 'src/context/TableriseContext';
import ChildrenNode from 'src/types/shared/children';

export default function TableriseProvider({ children }: ChildrenNode) {
    const [loading, setLoading] = useState<boolean>(false);
    const value = useMemo(() => ({
        loading,
        setLoading
    }), [
        loading
    ]);

    return (
        <TableriseContext.Provider value={value}>
            {children}
        </TableriseContext.Provider>
    );
};
