"use client";
import React, { useState, useEffect } from "react";
import { Settings, Eye, Sparkles, Zap } from "lucide-react";
import {
  getAllFlags,
  initFirebase,
  subscribeToUpdates,
} from "@/lib/firebase-client";

export default function FeatureFlagDemo() {
  const [flags, setFlags] = useState({
    darkMode: false,
    animations: false,
    premiumBadge: false,
  });
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const rc = initFirebase();

    getAllFlags(rc).then((flags) => {
      console.log("flags", flags);
      setFlags(flags);
    });

    subscribeToUpdates(rc, () => {
      getAllFlags(rc).then(setFlags);
    });
  }, []);

  async function updateFlag(key: string, value: boolean) {
    setIsLoading(true);
    await fetch("/api/update-flag", {
      method: "POST",
      body: JSON.stringify({ key, value }),
      headers: { "Content-Type": "application/json" },
    });
    setIsLoading(false);

    setFlags((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div
      className={`min-h-screen ${
        flags.darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              flags.darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Feature Flag Demo
          </h1>
          <p
            className={`${flags.darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Toggle features on and off to see them in action
          </p>
        </div>

        <div
          className={`${
            flags.darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-6 mb-8`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings
              className={flags.darkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
            <h2
              className={`text-2xl font-semibold ${
                flags.darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Feature Flags
            </h2>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed"
              style={{ borderColor: flags.darkMode ? "#3b82f6" : "#e5e7eb" }}
            >
              <div className="flex items-center gap-3">
                <Eye
                  size={20}
                  className={flags.darkMode ? "text-blue-400" : "text-gray-600"}
                />
                <div>
                  <div
                    className={`font-semibold ${
                      flags.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Dark Mode
                  </div>
                  <div
                    className={`text-sm ${
                      flags.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status:
                    <span
                      className={`font-bold ${
                        flags.darkMode ? "text-green-400" : "text-red-500"
                      }`}
                    >
                      {flags.darkMode ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateFlag("darkMode", !flags.darkMode)}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  flags.darkMode
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-70`}
              >
                {flags.darkMode ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed"
              style={{ borderColor: flags.animations ? "#3b82f6" : "#e5e7eb" }}
            >
              <div className="flex items-center gap-3">
                <Sparkles
                  size={20}
                  className={flags.darkMode ? "text-blue-400" : "text-gray-600"}
                />
                <div>
                  <div
                    className={`font-semibold ${
                      flags.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Animation
                  </div>
                  <div
                    className={`text-sm ${
                      flags.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        flags.animations ? "text-green-400" : "text-red-500"
                      }`}
                    >
                      {flags.animations ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateFlag("animations", !flags.animations)}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  flags.animations
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-70`}
              >
                {flags.animations ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {/* Premium Badge Toggle */}
            <div
              className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed"
              style={{
                borderColor: flags.premiumBadge ? "#3b82f6" : "#e5e7eb",
              }}
            >
              <div className="flex items-center gap-3">
                <Zap
                  size={20}
                  className={flags.darkMode ? "text-blue-400" : "text-gray-600"}
                />
                <div>
                  <div
                    className={`font-semibold ${
                      flags.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Premium Badge
                  </div>
                  <div
                    className={`text-sm ${
                      flags.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        flags.premiumBadge ? "text-green-400" : "text-red-500"
                      }`}
                    >
                      {flags.premiumBadge ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateFlag("premiumBadge", !flags.premiumBadge)}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  flags.premiumBadge
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                } disabled:opacity-70`}
              >
                {flags.premiumBadge ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Content Area */}
        <div
          className={`${
            flags.darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg p-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <h3
              className={`text-2xl font-semibold ${
                flags.darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome, User
            </h3>
            {flags.premiumBadge && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Zap size={14} fill="currentColor" />
                PREMIUM
              </span>
            )}
          </div>

          <div
            className={`${flags.animations ? "animate-pulse" : ""} ${
              flags.darkMode ? "bg-gray-700" : "bg-gray-100"
            } rounded-lg p-6`}
          >
            <p
              className={`text-lg ${
                flags.darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              This is a demo content area showing how features change the UI.
            </p>
            <ul
              className={`mt-4 space-y-2 ${
                flags.darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <li>
                • Dark Mode:{" "}
                {flags.darkMode ? "Changes color scheme ✓" : "Not active"}
              </li>
              <li>
                • Animation:{" "}
                {flags.animations ? "Adds pulsing effect ✓" : "Static display"}
              </li>
              <li>
                • Premium Badge:{" "}
                {flags.premiumBadge ? "Shows next to name ✓" : "Hidden"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
