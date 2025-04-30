// The function will freeze or unfreeze a user account
export const freezeToggleAccount = async (user) => {
  try {
    const previousStatus = user.isFrozen;
    // Toggle the freeze status
    user.isFrozen = !previousStatus;
    await user.save();

    return { success: true, status: user.isFrozen };
  } catch (err) {
    console.error("Error freezing/unfreezing account: ", err.message);
    throw new Error("An error occurred while toggling the freeze status");
  }
};
