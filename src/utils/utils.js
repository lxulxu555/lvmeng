export default function SubmitForm(data){
    let new_form = {}
    for (let i in data){
        if (data[i] !==""){
            new_form[i] = data[i]
        }
    }
    return new_form
}