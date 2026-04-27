import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "./Button";

const schema = z.object({
    amount: z.number({ error: "Amount is required" }).positive("Amount must be greater than 0"),
    type: z.enum(["payment", "receive"]),
});

type FormValues = z.infer<typeof schema>;

function TransactionForm({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
    const userId = "4af1d33b-5cda-4adc-bdb3-7abee5e45d74";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { type: "payment" },
    });

    const onSubmit = async (data: FormValues) => {
        const response = await fetch("http://localhost:8000/transactions/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Idempotency-Key": uuidv4(),
            },
            body: JSON.stringify({
                amount: data.amount,
                user_id: userId,
                transaction_type: data.type,
            }),
        });

        const result = await response.json();
        console.log("sent transaction:", result);

        if (response.ok) {
            reset();
            setIsOpen(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start">
                <label htmlFor="userId">User ID</label>
                <input
                    type="text"
                    disabled
                    value={userId}
                    className="p-2 border border-gray-300 rounded bg-gray-200 text-gray-500"
                />
            </div>
            <div className="flex flex-col gap-2 items-start">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    {...register("amount", { valueAsNumber: true })}
                    className="p-2 border border-gray-300 rounded"
                />
                {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
            </div>
            <div className="flex flex-col gap-2 items-start">
                <label htmlFor="type">Type</label>
                <select id="type" {...register("type")} className="p-2 border border-gray-300 rounded w-full">
                    <option value="payment">Payment</option>
                    <option value="receive">Receive</option>
                </select>
            </div>
            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 bg-gray-200 rounded cursor-pointer text-sm font-medium"
                >
                    Cancel
                </button>
                <Button text="Submit" onClick={() => { }} type="submit" />
            </div>
        </form>
    );
}

export default TransactionForm;
