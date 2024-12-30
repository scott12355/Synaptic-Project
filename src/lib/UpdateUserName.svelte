<script>
  import { supabase } from "./db";

  export let user;
  export let showModal = false; // Control visibility of the modal

  let newDisplayName = ""; // Bind input to this variable

  async function updateDisplayName(userId, newDisplayName) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ display_name: newDisplayName })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating display name:", error);
      return null;
    }

    return data;
  }

  async function handleSubmit() {
    if (!newDisplayName) {
      alert("Please enter a valid display name.");
      return;
    }

    const updatedData = await updateDisplayName(user.id, newDisplayName);

    if (updatedData) {
      alert("Display name updated successfully!");
      showModal = false; // Close the modal
    }
  }

  function closeModal() {
    showModal = false;
  }
</script>

{#if showModal}
  <div class="modal">
    <div class="modal-content">
      <h2>Update Display Name</h2>

      <input
        type="text"
        placeholder="Enter new display name"
        bind:value={newDisplayName}
      />

      <div>
        <button on:click={handleSubmit}>Update</button>
        <button on:click={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
  }

  .modal-content input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .modal-content button {
    margin: 0 0.5rem;
  }
</style>
