import { fireEvent, render, screen } from "@testing-library/react";
import AppealForm from "../AppealForm";

test("rejects blank answers and submits all completed fields", () => {
  const onSubmit = jest.fn();
  render(<AppealForm onSubmit={onSubmit} submitting={false} />);
  const submit = screen.getByRole("button", { name: "Submit Appeal" });
  const reason = screen.getByRole("textbox", { name: /why you were banned/i });
  fireEvent.change(reason, { target: { value: "   " } });
  const form = submit.closest("form");
  if (!form) throw new Error("Expected an appeal form");
  fireEvent.submit(form);
  expect(onSubmit).not.toHaveBeenCalled();

  fireEvent.change(reason, { target: { value: "I broke a rule." } });
  fireEvent.change(screen.getByRole("textbox", { name: /make amends/i }), {
    target: { value: "I apologized." },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /avoid repeating/i }), {
    target: { value: "I will review the rules." },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /anything else/i }), {
    target: { value: "Thank you." },
  });
  fireEvent.click(submit);
  expect(onSubmit).toHaveBeenCalledWith({
    reason: "I broke a rule.",
    solution: "I apologized.",
    future: "I will review the rules.",
    extra: "Thank you.",
  });
});

test("warns near the shared limit and blocks submissions over it", () => {
  const onSubmit = jest.fn();
  const { rerender } = render(
    <AppealForm onSubmit={onSubmit} submitting={false} />,
  );
  const [reason, solution, future, extra] = screen.getAllByRole("textbox");
  for (const field of [reason, solution, future]) {
    fireEvent.change(field, { target: { value: "x" } });
  }
  fireEvent.change(extra, { target: { value: "x".repeat(3597) } });
  expect(screen.getByText(/3600\/3600.*getting close/i)).toBeVisible();
  const submit = screen.getByRole("button", { name: "Submit Appeal" });
  expect(submit).toBeEnabled();
  fireEvent.change(extra, { target: { value: "x".repeat(3598) } });
  expect(screen.getByText(/3601\/3600.*too long/i)).toBeVisible();
  expect(submit).toBeDisabled();
  const form = submit.closest("form");
  if (!form) throw new Error("Expected the submit button to be inside a form");
  fireEvent.submit(form);
  expect(onSubmit).not.toHaveBeenCalled();

  rerender(<AppealForm onSubmit={onSubmit} submitting />);
  expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
});
