
import { useState } from 'react';

export const useForm = (initialObj = {}) => {
    const [form, setForm] = useState(initialObj);
    const changed = ({target}) =>{
        setForm({
            ...form,
            [target.name]: target.value
        })
    }
  return {
    form,
    changed
  }
}
