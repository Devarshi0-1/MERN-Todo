import { ReactElement } from 'react'
import { MdDelete } from 'react-icons/md'

type TProp = {
    id: string
    title: string
    desc: string
    isCompleted: boolean
    loading: boolean
    handleTodoUpdate: (id: string) => void
    handleTodoDelete: (id: string) => void
}

const TodoItem = ({
    id,
    title,
    desc,
    isCompleted,
    loading,
    handleTodoUpdate,
    handleTodoDelete,
}: TProp): ReactElement => {
    return (
        <div
            className='flex w-full items-center justify-between rounded-lg bg-gradient-to-br from-[rgb(255,255,255,0.1)] to-transparent px-4 py-2'
            style={{ opacity: loading ? 0.5 : undefined }}>
            <div className=''>
                <p className='text-3xl'>{title}</p>
                <p className='text-[rgb(255,255,255,0.6)]'>{desc}</p>
            </div>
            <div className='flex items-center gap-3'>
                <input
                    type='checkbox'
                    checked={isCompleted}
                    onChange={() => handleTodoUpdate(id)}
                    className='scale-[2] cursor-pointer p-10'
                />
                <MdDelete
                    onClick={() => handleTodoDelete(id)}
                    className='cursor-pointer fill-red-400  text-4xl'
                />
            </div>
        </div>
    )
}
export default TodoItem
