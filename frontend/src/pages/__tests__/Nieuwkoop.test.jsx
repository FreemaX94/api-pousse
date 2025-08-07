/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// 1. Mock correct de AssignModal depuis src/components
vi.mock("../../components/AssignModal.jsx", () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? <div data-testid="modal"><button onClick={onClose}>close</button></div> : null,
}));

import Nieuwkoop from "../Nieuwkoop.jsx";
import * as clientApi from "../../api/clientApi.js";

// mock global fetch et URL.createObjectURL
global.fetch = vi.fn();
global.URL.createObjectURL = vi.fn(() => "blob:url");

describe("Nieuwkoop.jsx", () => {
  const fakeStock = [
    { _id: "1", name: "Plant A", price: 5, quantity: 2, diameter: 10, height: 20, image: "url" },
  ];
  const fakeProjects = [{ _id: "p1", name: "Projet Test" }];
  const fakeMovements = [{ _id: "m1", itemId: "1", quantity: 3 }];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(clientApi, "getProjects").mockResolvedValue(fakeProjects);
    vi.spyOn(clientApi, "getMovements").mockResolvedValue(fakeMovements);
    vi.spyOn(clientApi, "assignItemToProject").mockResolvedValue({});
    fetch.mockResolvedValue({
      ok: true,
      json: async () => fakeStock,
    });
  });

  test("fetchStock charge et affiche les items", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/nieuwkoop/stock");
      expect(screen.getByText("Plant A")).toBeInTheDocument();
    });
  });

  test("openAssign et closeAssign gèrent le modal", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /\+ Ajouter au projet/ }));
    expect(screen.getByTestId("modal")).toBeVisible();
    fireEvent.click(screen.getByText("close"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).toBeNull();
    });
  });

  test("handleAssign appelle assignItemToProject et recharge", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /\+ Ajouter au projet/ }));
    fireEvent.change(screen.getByLabelText(/Projet/i), { target: { value: "p1" } });
    fireEvent.change(screen.getByLabelText(/Quantité/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Note/i), { target: { value: "Note test" } });
    fireEvent.click(screen.getByRole("button", { name: /Confirmer/i }));
    await waitFor(() => {
      expect(clientApi.assignItemToProject).toHaveBeenCalledWith(
        expect.objectContaining({ projectId: "p1", quantity: 1, note: "Note test" })
      );
    });
  });

  test("deleteItem retire un item du stock", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /🗑️/ }));
    await waitFor(() => {
      expect(screen.queryByText("Plant A")).toBeNull();
    });
  });

  test("updateQuantity appelle l’API de mise à jour", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => fakeStock })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ _id: "1", quantity: 5 }) });
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    const input = screen.getByDisplayValue("2");
    fireEvent.change(input, { target: { value: "5" } });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/nieuwkoop/stock/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ quantity: 5 }),
        })
      );
    });
  });

  test("handleAddToStock invoque les bonnes API", async () => {
    const newItem = { _id: "2", /* ... */ };
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => fakeStock })               // stock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ item: {} }) })         // détails
      .mockResolvedValueOnce({ ok: true, json: async () => ({ price: { PriceNett: 1 } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => newItem });               // ajout
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /Rechercher/ }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /➕ Ajouter un article/ })).toBeEnabled()
    );
    fireEvent.click(screen.getByRole("button", { name: /➕ Ajouter un article/ }));
    await waitFor(() => {
      const foundPost = fetch.mock.calls.some(
        ([url, opts]) => url === "/api/nieuwkoop/stock" && opts.method === "POST"
      );
      expect(foundPost).toBe(true);
    });
  });

  test("handleClearAll vide le stock", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /Tout vider/ }));
    await waitFor(() => {
      expect(screen.queryByText("Plant A")).toBeNull();
    });
  });

  test("handleExportCSV crée un lien de download", async () => {
    render(<Nieuwkoop />);
    fireEvent.click(screen.getByRole("button", { name: /Stock/ }));
    await screen.findByText("Plant A");
    fireEvent.click(screen.getByRole("button", { name: /Export CSV/ }));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
